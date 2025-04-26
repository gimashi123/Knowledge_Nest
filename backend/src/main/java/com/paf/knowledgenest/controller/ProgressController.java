package com.paf.knowledgenest.controller;

    import com.paf.knowledgenest.dto.requests.ProgressRequestDTO;
    import com.paf.knowledgenest.dto.responses.ProgressResponseDTO;
    import com.paf.knowledgenest.service.ProgressService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    @RequestMapping("/api/progress")
    public class ProgressController {

        private final ProgressService progressService;

        @Autowired
        public ProgressController(ProgressService progressService) {
            this.progressService = progressService;
        }

        @PostMapping("/add") // 1. req is getting as a post method
        public ResponseEntity<ProgressResponseDTO> addProgress(@RequestBody ProgressRequestDTO progressRequestDTO) { //2. body will get the data
            ProgressResponseDTO addedProgress = progressService.addNewProgress(progressRequestDTO); // 3. that should be passed to the service layer

            //The addedProgress variable will be null if the progress is not added successfully

            //We need to check if the addedProgress variable is null or not
            if (addedProgress != null) {
                //If it is not null, we need to return the addedProgress variable as a created status and body will be the response body
                return ResponseEntity.status(HttpStatus.CREATED).body(addedProgress);
            }

            //If it is null, we need to return a bad request status and body will be null since there was an error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }