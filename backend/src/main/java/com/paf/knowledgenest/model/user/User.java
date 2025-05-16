package com.paf.knowledgenest.model.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Setter
@Getter
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    private String username;

    private String email;

    private String password;

    private String role;

    private String profilePic;

    private List<String> followers;

    private List<String> following;

    private Integer userCoins = 0;


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
