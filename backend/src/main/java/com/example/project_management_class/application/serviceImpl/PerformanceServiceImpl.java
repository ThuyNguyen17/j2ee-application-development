package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.PerformanceService;
import com.example.project_management_class.domain.model.Score;
import com.example.project_management_class.domain.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements PerformanceService {
    private final ScoreRepository scoreRepository;

    @Override
    public List<Score> getAllPerformance() {
        return scoreRepository.findAll();
    }
}
