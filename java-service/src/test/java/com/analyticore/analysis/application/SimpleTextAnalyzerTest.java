package com.analyticore.analysis.application;

import com.analyticore.analysis.infrastructure.SimpleTextAnalyzer;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SimpleTextAnalyzerTest {
    private final SimpleTextAnalyzer analyzer = new SimpleTextAnalyzer();

    @Test void detectsPositiveSentimentAndKeywords() {
        var result = analyzer.analyze("Excelente servicio, excelente experiencia y gran servicio");
        assertThat(result.sentiment()).isEqualTo("POSITIVO");
        assertThat(result.keywords()).contains("excelente", "servicio");
    }

    @Test void detectsNegativeSentiment() {
        assertThat(analyzer.analyze("Un producto malo y terrible").sentiment()).isEqualTo("NEGATIVO");
    }
}

