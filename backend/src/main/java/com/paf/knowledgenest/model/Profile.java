package com.paf.knowledgenest.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @Field(name = "user_id")
    private Long userId;

    private String username;

    @Indexed(unique = true)
    private String email;

    private String bio;

    private List<String> skills;

    public Profile(Long userId, String username, String email, String bio, List<String> skills) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.skills = skills;
    }
}
