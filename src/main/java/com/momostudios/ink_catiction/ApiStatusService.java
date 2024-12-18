package com.momostudios.ink_catiction;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class ApiStatusService {

    private final ConcurrentHashMap<String, Long> lastSeen;

    public ApiStatusService() {
        this.lastSeen = new ConcurrentHashMap<String, Long>();
    }

    public void hasSeen(String usrname/*, long timestamp */) {
		// Ignore system messages from showing as an active user
        if(usrname.matches("System")) return;
		
		this.lastSeen.put(usrname,System.currentTimeMillis());
    }

    public List<String> isConnected(long threshold) {       
        // SON DOS FORMAS DE HACER LO MISMO
        List<String> connected = new ArrayList<>();
        long currentTime = System.currentTimeMillis();
        for(var entry : this.lastSeen.entrySet()) {
            if(entry.getValue() > (currentTime - threshold)) {
                connected.add(entry.getKey());
            }
        }
        return connected;
        //return this.lastSeen.entrySet().stream().filter((entry) -> entry.getValue() > (currentTime-threshold)).map((entry) -> entry.getValue()).collect(Collectors.toList()); 
    }

    public int numberOfUsersConnected(long threshold) {       
        return this.isConnected(threshold).size();
    }

}
