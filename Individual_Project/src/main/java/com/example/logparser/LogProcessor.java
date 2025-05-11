package com.example.logparser;

import com.example.logparser.factory.LogEntryFactory;
import com.example.logparser.handlers.*;
import com.example.logparser.utils.OutputWriter;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Component
public class LogProcessor {
    private final Map<String, LogHandler> handlers = new HashMap<>();

    @PostConstruct
    public void setup() {
        handlers.put("APM", new APMHandler());
        handlers.put("Application", new ApplicationHandler());
        handlers.put("Request", new RequestHandler());
    }

    public void processFile(String filename) throws IOException {
        List<String> lines = Files.readAllLines(Paths.get(filename));
        for (String line : lines) {
            Optional<LogHandler> handler = LogEntryFactory.getHandler(line, handlers);
            handler.ifPresent(h -> h.parseLine(line));
        }

        handlers.forEach((type, handler) -> {
            try {
                OutputWriter.writeToJson(type.toLowerCase() + ".json", handler.getResult());
            } catch (IOException e) {
                System.err.println("Failed to write " + type + ": " + e.getMessage());
            }
        });
    }
}