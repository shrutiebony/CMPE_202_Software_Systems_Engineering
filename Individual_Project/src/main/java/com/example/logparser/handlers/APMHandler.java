package com.example.logparser.handlers;

import java.util.*;

public class APMHandler implements LogHandler {
    private final Map<String, List<Double>> metrics = new HashMap<>();

    public void parseLine(String line) {
        String[] parts = line.split(" ");
        String metric = null;
        Double value = null;
        for (String part : parts) {
            if (part.startsWith("metric=")) metric = part.split("=", 2)[1];
            if (part.startsWith("value=")) value = Double.parseDouble(part.split("=", 2)[1]);
        }
        if (metric != null && value != null) {
            metrics.computeIfAbsent(metric, k -> new ArrayList<>()).add(value);
        }
    }

    public Object getResult() {
        Map<String, Map<String, Double>> result = new HashMap<>();
        for (String metric : metrics.keySet()) {
            List<Double> values = metrics.get(metric);
            Collections.sort(values);
            Map<String, Double> stats = new HashMap<>();
            stats.put("minimum", values.get(0));
            stats.put("median", values.get(values.size() / 2));
            stats.put("average", values.stream().mapToDouble(v -> v).average().orElse(0));
            stats.put("max", values.get(values.size() - 1));
            result.put(metric, stats);
        }
        return result;
    }
}