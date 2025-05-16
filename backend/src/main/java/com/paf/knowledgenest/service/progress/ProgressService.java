package com.paf.knowledgenest.service.progress;

import com.paf.knowledgenest.dto.requests.ProgressRequestDTO;
import com.paf.knowledgenest.dto.responses.ProgressResponseDTO;
import com.paf.knowledgenest.enums.CoinType;
import com.paf.knowledgenest.model.Progress;
import com.paf.knowledgenest.repository.ProgressRepository;
import com.paf.knowledgenest.repository.challenges.ChallengeRepository;
import com.paf.knowledgenest.service.socialFeature.SocialService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProgressService {


    private final ProgressRepository progressRepository;
    private final SocialService socialService;

    @Autowired
    public ProgressService(ProgressRepository progressRepository, SocialService socialService) {
        this.progressRepository = progressRepository;
        this.socialService = socialService;
    }

    public ProgressResponseDTO addNewProgress(ProgressRequestDTO progressRequestDTO) {

            try {
                ProgressResponseDTO progressResponseDTO = new ProgressResponseDTO(); // this will be the response object (if any error it should return null)


                if (progressRequestDTO.getTitle() == null || progressRequestDTO.getTopics() == null ) {
                    log.error("addNewProgress: title and topics and progress are null");
                    return null;
                }

                if (progressRepository.existsProgressByProgressAndTitle(0, progressRequestDTO.getTitle())) {
                    log.error("addNewProgress: progress already exists");
                    return null;
                }

                //Now we need to convert ProgressRequestDTO to Progress to save to db
                Progress progress = new Progress(); //Create a new Progress object


                //Set the values from ProgressRequestDTO to Progress
                progress.setTitle(progressRequestDTO.getTitle());
                progress.setTopics(progressRequestDTO.getTopics());
                progress.setProgress(0);
                progress.setLastUpdate( LocalTime.now());


                if(progressRequestDTO.getUserId() != null) {
                    socialService.addUserCoins(progressRequestDTO.getUserId(), CoinType.CHALLENGE_CREATION);
                }


                // Save the progress object to the database
                Progress addedProgress = progressRepository.save(progress); // the added progress object will be returned and saved in addedProgress variable

                //Then we need to set the values from addedProgress to progressResponseDTO to return to frontend
                progressResponseDTO.setTitle(addedProgress.getTitle());
                progressResponseDTO.setTopics(addedProgress.getTopics());
                progressResponseDTO.setProgress(addedProgress.getProgress());
                progressResponseDTO.setLastUpdate(addedProgress.getLastUpdate());
                log.info("addNewProgress: progress added");




                //After that we need to return the progressResponseDTO object
                return progressResponseDTO;
            }catch (Exception e) {

                log.error("addNewProgress: error while adding progress", e);
                //If any error occurs, we need to return null
                return null;
            }
        }

    public List<ProgressResponseDTO> getAllProgress() {
        try {
            List<Progress> progressList = progressRepository.findAll();

            return progressList.stream().map(progress -> {
                ProgressResponseDTO responseDTO = new ProgressResponseDTO();
                responseDTO.setProgressId(progress.getProgressId());
                responseDTO.setTitle(progress.getTitle());
                responseDTO.setTopics(progress.getTopics());
                responseDTO.setProgress(progress.getProgress());
                responseDTO.setLastUpdate(progress.getLastUpdate());
                return responseDTO;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("getAllProgress: error while fetching all progress", e);
            return null;
        }
    }

    public ProgressResponseDTO getProgressById(String progressId) {
        try {
            Optional<Progress> progressOptional = progressRepository.findByProgressId(progressId);

            if (progressOptional.isPresent()) {
                Progress progress = progressOptional.get();
                ProgressResponseDTO responseDTO = new ProgressResponseDTO();
                responseDTO.setProgressId(progress.getProgressId());
                responseDTO.setTitle(progress.getTitle());
                responseDTO.setTopics(progress.getTopics());
                responseDTO.setProgress(progress.getProgress());
                responseDTO.setLastUpdate(progress.getLastUpdate());
                return responseDTO;
            } else {
                log.error("getProgressById: progress not found with id: {}", progressId);
                return null;
            }
        } catch (Exception e) {
            log.error("getProgressById: error while fetching progress", e);
            return null;
        }
    }

    public ProgressResponseDTO updateProgress(String progressId, ProgressRequestDTO progressRequest) {
        try {
            Optional<Progress> progressOptional = progressRepository.findByProgressId(progressId);

            if (progressOptional.isPresent()) {
                Progress progress = progressOptional.get();

                if (progressRequest.getTitle() != null) {
                    progress.setTitle(progressRequest.getTitle());
                }

                if (progressRequest.getTopics() != null) {
                    progress.setTopics(progressRequest.getTopics());
                }

                if (progressRequest.getProgress() != null) {
                    progress.setProgress(progressRequest.getProgress());
                }

                if(progressRequest.getUserId() != null) {
                   if( progress.getProgress() >= 100){
                       socialService.addUserCoins(progressRequest.getUserId(), CoinType.PROGRESS_COMPLETION);
                   }
                }

                // Always update the last update time
                progress.setLastUpdate(LocalTime.now());

                Progress updatedProgress = progressRepository.save(progress);

                ProgressResponseDTO responseDTO = new ProgressResponseDTO();
                responseDTO.setProgressId(updatedProgress.getProgressId());
                responseDTO.setTitle(updatedProgress.getTitle());
                responseDTO.setTopics(updatedProgress.getTopics());
                responseDTO.setProgress(updatedProgress.getProgress());
                responseDTO.setLastUpdate(updatedProgress.getLastUpdate());

                return responseDTO;
            } else {
                log.error("updateProgress: progress not found with id: {}", progressId);
                return null;
            }
        } catch (Exception e) {
            log.error("updateProgress: error while updating progress", e);
            return null;
        }
    }

    public boolean deleteProgress(String progressId) {
        try {
            if (progressRepository.findByProgressId(progressId).isPresent()) {
                progressRepository.deleteByProgressId(progressId);
                log.info("deleteProgress: progress deleted with id: {}", progressId);
                return true;
            } else {
                log.error("deleteProgress: progress not found with id: {}", progressId);
                return false;
            }
        } catch (Exception e) {
            log.error("deleteProgress: error while deleting progress", e);
            return false;
        }
    }

}
