package com.businessbear.server.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdminUserRequest {
    private String fullName;
    private String username;
    private String email;
    private String mobile;
    private String password;
    private List<Long> roleIds;
}
