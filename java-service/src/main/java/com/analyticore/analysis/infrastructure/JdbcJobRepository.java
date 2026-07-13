package com.analyticore.analysis.infrastructure;

import com.analyticore.analysis.domain.AnalysisResult;
import com.analyticore.analysis.domain.Job;
import com.analyticore.analysis.domain.JobRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcJobRepository implements JobRepository {
    private final JdbcTemplate jdbc;

    public JdbcJobRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Override
    @Transactional
    public Optional<Job> claimPending(UUID id) {
        int updated = jdbc.update("UPDATE analysis_jobs SET status='PROCESANDO', updated_at=now() WHERE id=? AND status='PENDIENTE'", id);
        if (updated == 0) return Optional.empty();
        return jdbc.query("SELECT id, text, status FROM analysis_jobs WHERE id=?",
                (rs, row) -> new Job(rs.getObject("id", UUID.class), rs.getString("text"), rs.getString("status")), id).stream().findFirst();
    }

    @Override
    public void complete(UUID id, AnalysisResult result) {
        jdbc.update(connection -> {
            var statement = connection.prepareStatement("UPDATE analysis_jobs SET status='COMPLETADO', sentiment=?, keywords=?, error=NULL, updated_at=now() WHERE id=?");
            statement.setString(1, result.sentiment());
            statement.setArray(2, connection.createArrayOf("varchar", result.keywords().toArray()));
            statement.setObject(3, id);
            return statement;
        });
    }

    @Override
    public void fail(UUID id, String reason) {
        jdbc.update("UPDATE analysis_jobs SET status='FALLIDO', error=?, updated_at=now() WHERE id=?", reason, id);
    }
}
