package com.paf.knowledgenest.controller;

import com.paf.knowledgenest.dto.request.ProfileRequestDTO;
import com.paf.knowledgenest.dto.response.ProfileResponseDTO;
import com.paf.knowledgenest.model.Profile;
import com.paf.knowledgenest.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping("/create")
    public ResponseEntity<ProfileResponseDTO> createProfile(@RequestBody ProfileRequestDTO profileRequestDTO) {
        log.info("Attempting to create profile : {}", profileRequestDTO.getUsername());

        ProfileResponseDTO profileResponseDTO = profileService.createProfile(profileRequestDTO);
        return new ResponseEntity<>(profileResponseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public List<Profile> getAllProfiles() {
        log.info("Attempting to get all profiles");
        return profileService.getAllProfiles();
    }

   @GetMapping("/get/{id}")
    public Optional<Profile> getProfileById(@PathVariable String id) {
        log.info("Attempting to get profile by id : {}", id);
        return profileService.getProfileById(id);
    }

    @PutMapping("/update/{id}")
    public Optional<Profile> updateProfile(@PathVariable String id, @RequestBody ProfileRequestDTO profileRequestDTO) {
        log.info("Attempting to update profile : {}", profileRequestDTO.getUsername());
        return profileService.updateProfile(id, profileRequestDTO);
    }

    @DeleteMapping("/remove/{id}")
    public void deleteProfile(@PathVariable String id) {
        log.info("Attempting to delete profile by id : {}", id);
        profileService.deleteProfile(id);
    }

}
