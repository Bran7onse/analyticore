package com.analyticore.analysis.application;

import com.analyticore.analysis.domain.Job;
import com.analyticore.analysis.domain.JobRepository;
import com.analyticore.analysis.domain.TextAnalyzer;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AnalyzeJob {
    private final JobRepository jobs;
    private final TextAnalyzer analyzer;

    public AnalyzeJob(JobRepository jobs, TextAnalyzer analyzer) {
        this.jobs = jobs;
        this.analyzer = analyzer;
    }

    @Async("analysisExecutor")
    public void execute(UUID jobId) {
        Job job = jobs.claimPending(jobId).orElse(null);
        if (job == null) return;
        try {
            jobs.complete(jobId, analyzer.analyze(job.text()));
        } catch (RuntimeException exception) {
            jobs.fail(jobId, "No fue posible analizar el texto");
        }
    }
}

