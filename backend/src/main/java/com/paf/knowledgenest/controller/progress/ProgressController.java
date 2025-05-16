package com.paf.knowledgenest.controller.progress;

    import com.paf.knowledgenest.dto.requests.ProgressRequestDTO;
    import com.paf.knowledgenest.dto.responses.ProgressResponseDTO;
    import com.paf.knowledgenest.service.progress.ProgressService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

@RestController
    @RequestMapping("/api/progress")
    public class ProgressController {

        private final ProgressService progressService;

        @Autowired
        public ProgressController(ProgressService progressService) {
            this.progressService = progressService;
        }

        @PostMapping("/add") // 1. req is getting as a post method
        public ResponseEntity<ProgressResponseDTO> addProgress(@RequestBody ProgressRequestDTO progressRequestDTO) {
            ProgressResponseDTO addedProgress = progressService.addNewProgress(progressRequestDTO);
            if (addedProgress != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(addedProgress);
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }


    @GetMapping("/all")
    public ResponseEntity<List<ProgressResponseDTO>> getAllProgress() {
        List<ProgressResponseDTO> progressList = progressService.getAllProgress();

        if (progressList != null && !progressList.isEmpty()) {
            return ResponseEntity.ok(progressList);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgressResponseDTO> getProgressById(@PathVariable("id") String progressId) {
        ProgressResponseDTO progress = progressService.getProgressById(progressId);

        if (progress != null) {
            return ResponseEntity.ok(progress);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgressResponseDTO> updateProgress(
            @PathVariable("id") String progressId,
            @RequestBody ProgressRequestDTO progressRequestDTO) {

        ProgressResponseDTO updatedProgress = progressService.updateProgress(progressId, progressRequestDTO);

        if (updatedProgress != null) {
            return ResponseEntity.ok(updatedProgress);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgress(@PathVariable("id") String progressId) {
        boolean isDeleted = progressService.deleteProgress(progressId);

        if (isDeleted) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    }