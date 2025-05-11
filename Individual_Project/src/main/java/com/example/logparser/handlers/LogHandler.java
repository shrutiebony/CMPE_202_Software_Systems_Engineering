package com.example.logparser.handlers;

public interface LogHandler {
    void parseLine(String line);
    Object getResult();
}