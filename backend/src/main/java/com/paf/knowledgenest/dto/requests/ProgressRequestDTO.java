package com.paf.knowledgenest.dto.requests;

import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class ProgressRequestDTO {
        private String title;
        private List<String> topics;
        private Integer progress;
        private LocalTime lastUpdate;
}
