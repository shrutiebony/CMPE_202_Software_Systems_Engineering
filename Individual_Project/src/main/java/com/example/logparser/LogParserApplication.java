package com.example.logparser;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class LogParserApplication {
    public static void main(String[] args) {
        SpringApplication.run(LogParserApplication.class, args);
    }

    @Bean
    public CommandLineRunner run(LogProcessor processor) {
        return args -> {
            if (args.length < 2 || !args[0].equals("--file")) {
                System.out.println("Usage: --file <filename.txt>");
                return;
            }
            processor.processFile(args[1]);
        };
    }
}