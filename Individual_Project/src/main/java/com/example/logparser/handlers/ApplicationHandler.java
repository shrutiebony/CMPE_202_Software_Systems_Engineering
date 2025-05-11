package com.example.logparser.handlers;

import java.util.HashMap;
import java.util.Map;

public class ApplicationHandler implements LogHandler {
    private final Map<String, Integer> severityCount = new HashMap<>();

    public void parseLine(String line) {
        for (String part : line.split(" ")) {
            if (part.startsWith("level=")) {
                String level = part.split("=", 2)[1];
                severityCount.put(level, severityCount.getOrDefault(level, 0) + 1);
            }
        }
    }

    public Object getResult() {
        return severityCount;
    }
}