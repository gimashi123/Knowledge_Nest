package com.paf.knowledgenest.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;
import java.util.List;

@Setter
@Getter
@Document(collection = "progress") // ✅ Corrected: collection, not collation
public class Progress {
    @Id
    private String progressId; // ✅ Use String for MongoDB ID (Mongo generates ObjectId as a string)

    @NotNull
    private String title;

    @NotNull
    private List<String> topics;

    @NotNull
    private Integer progress;

    @NotNull
    private LocalTime lastUpdate;
}
