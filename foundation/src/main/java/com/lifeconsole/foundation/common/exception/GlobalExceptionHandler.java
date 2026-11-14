package com.lifeconsole.foundation.common.exception;

import com.lifeconsole.foundation.common.response.ApiError;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException exception, WebRequest request) {
        return respond(exception, new HttpHeaders(), HttpStatus.NOT_FOUND, exception.getMessage(), request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {
        String details = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .distinct()
                .sorted()
                .collect(Collectors.joining("; "));
        String message = details.isEmpty() ? "Request validation failed." : "Request validation failed: " + details;
        return respond(exception, headers, status, message, request);
    }

    @Override
    protected ResponseEntity<Object> handleHandlerMethodValidationException(
            HandlerMethodValidationException exception, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {
        if (status.is5xxServerError()) {
            return handleExceptionInternal(exception, null, headers, status, request);
        }
        return respond(exception, headers, status, "Request validation failed.", request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException exception, WebRequest request) {
        return respond(exception, new HttpHeaders(), HttpStatus.BAD_REQUEST, "Request validation failed.", request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException exception, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {
        return respond(exception, headers, status, "Request body is missing or malformed.", request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception, Object body, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {
        String message = "An unexpected error occurred.";
        if (status.is5xxServerError()) {
            log.error("Request failed: {}", request.getDescription(false), exception);
        } else {
            HttpStatus resolvedStatus = HttpStatus.resolve(status.value());
            message = resolvedStatus != null ? resolvedStatus.getReasonPhrase() : "Request failed.";
        }
        return respond(exception, headers, status, message, request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnexpectedException(Exception exception, WebRequest request) {
        log.error("Unexpected request failure: {}", request.getDescription(false), exception);
        return respond(exception, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred.", request);
    }

    private ResponseEntity<Object> respond(
            Exception exception, HttpHeaders headers, HttpStatusCode status,
            String message, WebRequest request) {
        HttpStatus resolvedStatus = HttpStatus.resolve(status.value());
        String error = resolvedStatus != null ? resolvedStatus.getReasonPhrase() : "HTTP Error";
        String path = request instanceof ServletWebRequest servletRequest
                ? servletRequest.getRequest().getRequestURI()
                : request.getDescription(false);
        ApiError response = new ApiError(Instant.now(), status.value(), error, message, path);
        return super.handleExceptionInternal(exception, response, headers, status, request);
    }
}
