package com.analyticore.analysis.infrastructure;

import com.analyticore.analysis.domain.AnalysisResult;
import com.analyticore.analysis.domain.TextAnalyzer;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class SimpleTextAnalyzer implements TextAnalyzer {

    private static final Set<String> POSITIVE = Set.of(
            "bueno",
            "buena",
            "excelente",
            "feliz",
            "genial",
            "positivo",
            "positiva",
            "encanta",
            "amor",
            "recomiendo",
            "rapido",
            "rapida",
            "eficiente",
            "perfecto",
            "perfecta",
            "good",
            "great",
            "happy",
            "excellent",
            "love"
    );

    private static final Set<String> NEGATIVE = Set.of(
            "malo",
            "mala",
            "mal",
            "terrible",
            "triste",
            "pesimo",
            "pesima",
            "negativo",
            "negativa",
            "odio",
            "problema",
            "problemas",
            "error",
            "errores",
            "falla",
            "fallas",
            "horrible",
            "lento",
            "lenta",
            "inutil",
            "deficiente",
            "molesto",
            "molesta",
            "fracaso",
            "bad",
            "awful",
            "sad",
            "hate"
    );

    private static final Set<String> STOP_WORDS = Set.of(
            "para",
            "como",
            "pero",
            "este",
            "esta",
            "estos",
            "estas",
            "porque",
            "desde",
            "hasta",
            "sobre",
            "entre",
            "tambien",
            "tiene",
            "muchos",
            "muchas",
            "the",
            "and",
            "that",
            "this",
            "with",
            "from",
            "have",
            "una",
            "uno",
            "unos",
            "unas",
            "del",
            "las",
            "los",
            "por",
            "con",
            "que",
            "es",
            "en",
            "el",
            "la",
            "un",
            "de",
            "y",
            "a"
    );

    @Override
    public AnalysisResult analyze(String text) {
        List<String> words = Arrays.stream(
                        normalize(text).split("[^a-z0-9ñü]+")
                )
                .filter(word -> !word.isBlank())
                .toList();

        long positive = words.stream()
                .filter(POSITIVE::contains)
                .count();

        long negative = words.stream()
                .filter(NEGATIVE::contains)
                .count();

        String sentiment;

        if (positive > negative) {
            sentiment = "POSITIVO";
        } else if (negative > positive) {
            sentiment = "NEGATIVO";
        } else {
            sentiment = "NEUTRAL";
        }

        List<String> keywords = words.stream()
                .filter(word -> word.length() > 3)
                .filter(word -> !STOP_WORDS.contains(word))
                .collect(Collectors.groupingBy(
                        Function.identity(),
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .sorted(
                        Map.Entry.<String, Long>comparingByValue()
                                .reversed()
                                .thenComparing(Map.Entry.comparingByKey())
                )
                .limit(5)
                .map(Map.Entry::getKey)
                .toList();

        return new AnalysisResult(sentiment, keywords);
    }

    private String normalize(String text) {
        return Normalizer.normalize(
                        text.toLowerCase(Locale.ROOT),
                        Normalizer.Form.NFD
                )
                .replaceAll("\\p{M}", "");
    }
}