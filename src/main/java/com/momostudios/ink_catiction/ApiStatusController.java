package com.momostudios.ink_catiction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/status/")
public class ApiStatusController {
    @Autowired
    private final ApiStatusService apiStatusService;

    @Autowired
    private final long seenThreshold;

    public ApiStatusController(ApiStatusService apiStatusService, long seenThreshold){
        this.apiStatusService = apiStatusService;
        this.seenThreshold = seenThreshold;
    }

    @GetMapping("/connected-users")
    public ResponseEntity<connectedUsersResponse> getConnectedUsers() {
        int numberOfUsersConnected = this.apiStatusService.numberOfUsersConnected(this.seenThreshold);
        return ResponseEntity.ok(new connectedUsersResponse(numberOfUsersConnected));
    }
    
    record connectedUsersResponse(long connectedUsers){

    }
}