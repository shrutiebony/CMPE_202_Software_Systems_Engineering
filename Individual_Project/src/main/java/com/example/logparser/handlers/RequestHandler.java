package com.example.logparser.handlers;

import java.util.*;

public class RequestHandler implements LogHandler {
    private static class Stats {
        List<Integer> responseTimes = new ArrayList<>();
        Map<String, Integer> statusCodes = new HashMap<>();
    }

    private final Map<String, Stats> routeStats = new HashMap<>();

    public void parseLine(String line) {
        String url = null;
        Integer time = null;
        Integer status = null;

        for (String part : line.split(" ")) {
            if (part.startsWith("request_url=")) url = part.split("=", 2)[1].replace("\"", "");
            if (part.startsWith("response_time_ms=")) time = Integer.parseInt(part.split("=", 2)[1]);
            if (part.startsWith("response_status=")) status = Integer.parseInt(part.split("=", 2)[1]);
        }

        if (url != null && time != null && status != null) {
            Stats stats = routeStats.computeIfAbsent(url, k -> new Stats());
            stats.responseTimes.add(time);
            String statusCategory = (status / 100) + "XX";
            stats.statusCodes.put(statusCategory, stats.statusCodes.getOrDefault(statusCategory, 0) + 1);
        }
    }

    public Object getResult() {
        Map<String, Object> result = new HashMap<>();
        for (String url : routeStats.keySet()) {
            Stats stats = routeStats.get(url);
            List<Integer> times = stats.responseTimes;
            Collections.sort(times);
            Map<String, Object> routeResult = new HashMap<>();

            Map<String, Integer> timeStats = new LinkedHashMap<>();
            timeStats.put("min", times.get(0));
            timeStats.put("50_percentile", times.get(times.size() * 50 / 100));
            timeStats.put("90_percentile", times.get(times.size() * 90 / 100));
            timeStats.put("95_percentile", times.get(times.size() * 95 / 100));
            timeStats.put("99_percentile", times.get(times.size() * 99 / 100));
            timeStats.put("max", times.get(times.size() - 1));

            routeResult.put("response_times", timeStats);
            routeResult.put("status_codes", stats.statusCodes);
            result.put(url, routeResult);
        }
        return result;
    }
}