package com.sqlagent.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sqlagent.entity.QueryHistory;

public interface QueryHistoryRepository extends JpaRepository<QueryHistory, Long> {
    List<QueryHistory> findTop10ByOrderByCreatedAtDescIdDesc();
    
}
