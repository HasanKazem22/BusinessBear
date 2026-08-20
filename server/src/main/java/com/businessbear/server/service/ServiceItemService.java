package com.businessbear.server.service;

import com.businessbear.server.dto.ServiceDto;
import java.util.List;

public interface ServiceItemService {
    List<ServiceDto> getAllActiveServices();
    List<ServiceDto> getAllServicesAdmin();
    ServiceDto getServiceById(Long id);
    ServiceDto createService(ServiceDto serviceDto);
    ServiceDto updateService(Long id, ServiceDto serviceDto);
    void deleteService(Long id);
}
