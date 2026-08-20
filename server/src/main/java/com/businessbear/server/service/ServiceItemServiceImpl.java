package com.businessbear.server.service;

import com.businessbear.server.dto.ServiceDto;
import com.businessbear.server.entity.Service;
import com.businessbear.server.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceItemServiceImpl implements ServiceItemService {

    private final ServiceRepository serviceRepository;

    @Override
    public List<ServiceDto> getAllActiveServices() {
        return serviceRepository.findByIsActiveTrueOrderByDisplayOrderAscIdAsc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceDto> getAllServicesAdmin() {
        return serviceRepository.findAllByOrderByDisplayOrderAscIdAsc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceDto getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        return mapToDto(service);
    }

    @Override
    public ServiceDto createService(ServiceDto dto) {
        Service service = Service.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .iconName(dto.getIconName())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        Service saved = serviceRepository.save(service);
        return mapToDto(saved);
    }

    @Override
    public ServiceDto updateService(Long id, ServiceDto dto) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        service.setTitle(dto.getTitle());
        service.setDescription(dto.getDescription());
        if (dto.getIconName() != null) service.setIconName(dto.getIconName());
        if (dto.getDisplayOrder() != null) service.setDisplayOrder(dto.getDisplayOrder());
        if (dto.getIsActive() != null) service.setIsActive(dto.getIsActive());
        Service updated = serviceRepository.save(service);
        return mapToDto(updated);
    }

    @Override
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    private ServiceDto mapToDto(Service entity) {
        return ServiceDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .iconName(entity.getIconName())
                .displayOrder(entity.getDisplayOrder())
                .isActive(entity.getIsActive())
                .build();
    }
}
