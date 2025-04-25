package com.paf.knowledgenest.service;

import com.paf.knowledgenest.dto.request.ProfileRequestDTO;
import com.paf.knowledgenest.dto.response.ProfileResponseDTO;
import com.paf.knowledgenest.model.Profile;
import com.paf.knowledgenest.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public ProfileResponseDTO createProfile(ProfileRequestDTO dto) {
        Profile profile = new Profile(
                dto.getUserId(),
                dto.getUsername(),
                dto.getEmail(),
                dto.getBio(),
                dto.getSkills()
        );


        Profile savedProfile = profileRepository.save(profile);

        return ProfileResponseDTO.builder()
                .id(savedProfile.getId())
                .userId(savedProfile.getUserId())
                .username(savedProfile.getUsername())
                .email(savedProfile.getEmail())
                .bio(savedProfile.getBio())
                .skills(savedProfile.getSkills())
                .build();

    }

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public Optional<Profile> getProfileById(String id) {
        return profileRepository.findById(id);
    }

    public Optional<Profile> updateProfile(String id, ProfileRequestDTO dto) {
        return profileRepository.findById(id).map(existing -> {
            existing.setBio(dto.getBio());
            existing.setSkills(dto.getSkills());
            return profileRepository.save(existing);
        });
    }

    public void deleteProfile(String id) {
        profileRepository.deleteById(id);
    }
}
