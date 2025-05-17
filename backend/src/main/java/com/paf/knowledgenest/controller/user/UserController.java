package com.paf.knowledgenest.controller.user;

import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.repository.user.UserRepository;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserRepository userRepository;


    @PutMapping("/update-name")
    public ResponseEntity<?> updateName(@RequestParam String name, Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setName(name);
        userRepository.save(user);
        return ResponseEntity.ok("Name updated successfully");
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadProfilePic(@RequestParam("file") MultipartFile file, Authentication auth) throws IOException, java.io.IOException {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Save file to server or convert to Base64 (for demo, keep simple)
        byte[] bytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(bytes);
        user.setProfilePic(base64Image);
        userRepository.save(user);

        return ResponseEntity.ok("Profile picture uploaded successfully");
    }

    @DeleteMapping("/delete-photo")
    public ResponseEntity<?> deletePhoto(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setProfilePic(null);
        userRepository.save(user);
        return ResponseEntity.ok("Profile picture removed");
    }

    @GetMapping("/get-coins/{userId}")
    public ResponseEntity<?> getCoins(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ResponseEntity.ok(user.getUserCoins());
    }
}
