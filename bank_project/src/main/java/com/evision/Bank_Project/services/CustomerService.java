package com.evision.Bank_Project.services;

import com.evision.Bank_Project.dto.CustomerRequest;
import com.evision.Bank_Project.dto.CustomerResponse;
import com.evision.Bank_Project.models.Customer;
import com.evision.Bank_Project.repos.CustomerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CustomerResponse getCustomerById(Integer id) {
        return toResponse(findCustomerById(id));
    }

    private Customer findCustomerById(Integer id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Customer not found with id: " + id
                ));
    }

    public CustomerResponse createCustomer(CustomerRequest request) {
        Customer customer = new Customer();
        copyRequestToEntity(request, customer);
        return toResponse(customerRepository.save(customer));
    }

    public CustomerResponse updateCustomer(Integer id, CustomerRequest request) {
        Customer customer = findCustomerById(id);
        copyRequestToEntity(request, customer);
        return toResponse(customerRepository.save(customer));
    }

    public void deleteCustomer(Integer id) {
        Customer customer = findCustomerById(id);
        customerRepository.delete(customer);
    }

    private void copyRequestToEntity(CustomerRequest request, Customer customer) {
        customer.setFirstName(request.firstName());
        customer.setLastName(request.lastName());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
        customer.setDob(request.dob());
        customer.setNationalId(request.nationalId());
    }

    private CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getDob(),
                customer.getNationalId(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }
}
