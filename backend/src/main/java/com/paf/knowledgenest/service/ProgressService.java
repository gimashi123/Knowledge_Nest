package com.paf.knowledgenest.service;

import com.paf.knowledgenest.dto.requests.ProgressRequestDTO;
import com.paf.knowledgenest.dto.responses.ProgressResponseDTO;
import com.paf.knowledgenest.model.Progress;
import com.paf.knowledgenest.repository.ProgressRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ProgressService {

    @Autowired
    private final ProgressRepository progressRepository;

    private static final Logger log = LoggerFactory.getLogger(ProgressService.class);

    public ProgressService(ProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }


    // Method should be getting ProgressRequestDTO as parameter since its passing through controller
    // Response should be ProgressResponseDTO
    public ProgressResponseDTO addNewProgress(ProgressRequestDTO progressResponse) {

            try {
                ProgressResponseDTO progressResponseDTO = new ProgressResponseDTO(); // this will be the response object (if any error it should return null)

                if (progressResponse.getTitle() == null || progressResponse.getTopics() == null || progressResponse.getProgress() == null || progressResponse.getLastUpdate() == null) {
                    log.error("addNewProgress: title and topics and progress are null");
                    return null;
                }

                if (progressRepository.existsProgressByProgressAndTitle(progressResponse.getProgress(), progressResponse.getTitle())) {
                    log.error("addNewProgress: progress already exists");
                    return null;
                }

                //Now we need to convert ProgressRequestDTO to Progress to save to db
                Progress progress = new Progress(); //Create a new Progress object


                //Set the values from ProgressRequestDTO to Progress
                progress.setTitle(progressResponse.getTitle());
                progress.setTopics(progressResponse.getTopics());
                progress.setProgress(progressResponse.getProgress());
                progress.setLastUpdate(progressResponse.getLastUpdate());


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

}
