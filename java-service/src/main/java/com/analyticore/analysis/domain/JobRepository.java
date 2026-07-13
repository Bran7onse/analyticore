package com.analyticore.analysis.domain;

import java.util.Optional;
import java.util.UUID;

public interface JobRepository {
    Optional<Job> claimPending(UUID id);
    void complete(UUID id, AnalysisResult result);
    void fail(UUID id, String reason);
}

