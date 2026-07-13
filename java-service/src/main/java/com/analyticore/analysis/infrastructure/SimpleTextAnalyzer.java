package com.analyticore.analysis.infrastructure;

import com.analyticore.analysis.domain.AnalysisResult;
import com.analyticore.analysis.domain.TextAnalyzer;
import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class SimpleTextAnalyzer implements TextAnalyzer {
    private static final Set<String> POSITIVE = Set.of("bueno", "excelente", "feliz", "genial", "positivo", "encanta", "amor", "good", "great", "happy", "excellent", "love");
    private static final Set<String> NEGATIVE = Set.of("malo", "terrible", "triste", "pesimo", "negativo", "odio", "problema", "bad", "awful", "sad", "hate");
    private static final Set<String> STOP_WORDS = Set.of("para", "como", "pero", "este", "esta", "estos", "estas", "porque", "desde", "hasta", "sobre", "entre", "tambien", "tiene", "the", "and", "that", "this", "with", "from", "have", "una", "uno", "unos", "unas", "del", "las", "los", "por", "con", "que", "es", "en", "el", "la", "un", "de", "y", "a");

    @Override
    public AnalysisResult analyze(String text) {
        List<String> words = Arrays.stream(normalize(text).split("[^a-z0-9áéíóúñü]+"))
                .filter(word -> !word.isBlank()).toList();
        long positive = words.stream().filter(POSITIVE::contains).count();
        long negative = words.stream().filter(NEGATIVE::contains).count();
        String sentiment = positive > negative ? "POSITIVO" : negative > positive ? "NEGATIVO" : "NEUTRAL";
        List<String> keywords = words.stream().filter(word -> word.length() > 3 && !STOP_WORDS.contains(word))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey()))
                .limit(5).map(Map.Entry::getKey).toList();
        return new AnalysisResult(sentiment, keywords);
    }

    private String normalize(String text) {
        return Normalizer.normalize(text.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }
}
