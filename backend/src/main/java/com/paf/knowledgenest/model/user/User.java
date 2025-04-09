package com.paf.knowledgenest.model.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "users")
public class User {

    // Getters & Setters
    @Id
    private String id;

    @Setter
    private String name;     // Add this field
    @Setter
    private String username;
    @Setter
    private String email;
    @Setter
    private String password; // Hashed password
    @Setter
    private String role;     // "USER" or "ADMIN"

    // Constructors
    public User() {}

    public User(String name, String username, String email, String password) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = "USER";
    }

}
