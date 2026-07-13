package com.analyticore.analysis.presentation;

import com.analyticore.analysis.application.AnalyzeJob;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/internal/analyses")
public class AnalysisController {
    private final AnalyzeJob analyzeJob;

    public AnalysisController(AnalyzeJob analyzeJob) { this.analyzeJob = analyzeJob; }

    @PostMapping
    public ResponseEntity<Map<String, String>> start(@Valid @RequestBody StartAnalysisRequest request) {
        analyzeJob.execute(request.jobId());
        return ResponseEntity.accepted().location(URI.create("/internal/analyses/" + request.jobId()))
                .body(Map.of("jobId", request.jobId().toString(), "status", "ACEPTADO"));
    }

    public record StartAnalysisRequest(@NotNull UUID jobId) {}
}

