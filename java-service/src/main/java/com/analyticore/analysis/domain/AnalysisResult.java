package com.analyticore.analysis.domain;

import java.util.List;

public record AnalysisResult(String sentiment, List<String> keywords) {}

