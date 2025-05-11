package com.example.logparser.factory;

import com.example.logparser.handlers.LogHandler;
import java.util.Map;
import java.util.Optional;

public class LogEntryFactory {
    public static Optional<LogHandler> getHandler(String line, Map<String, LogHandler> handlers) {
        if (line.contains("metric=") && line.contains("value=")) return Optional.of(handlers.get("APM"));
        if (line.contains("level=") && line.contains("message=")) return Optional.of(handlers.get("Application"));
        if (line.contains("request_method=") && line.contains("request_url=")) return Optional.of(handlers.get("Request"));
        return Optional.empty();
    }
}