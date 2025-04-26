package com.paf.knowledgenest.dto.responses;

import lombok.*;


import java.time.LocalTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProgressResponseDTO {
    private String progressId;
    private String title;
    private List<String> topics;
    private Integer progress;
    private LocalTime lastUpdate;

}
