package org.example.logs;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {

    private final LogRepository repository;

    public LogController(LogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<LogEntry> getAllLogs() {
        return repository.findAll();
    }

    @PostMapping
    public LogEntry createLog(@RequestBody LogEntry log) {
        return repository.save(log);
    }
}
