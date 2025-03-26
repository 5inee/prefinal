import React from 'react';
import styled from 'styled-components';

const FormInput = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  icon: Icon,
  error
}) => {
  return (
    <FormGroup>
      {label && (
        <FormLabel htmlFor={name}>
          {label} {required && <RequiredStar>*</RequiredStar>}
        </FormLabel>
      )}
      
      <InputWrapper>
        {Icon && <IconWrapper><Icon /></IconWrapper>}
        <StyledInput
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          hasIcon={!!Icon}
          hasError={!!error}
        />
      </InputWrapper>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormGroup>
  );
};

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-color);
`;

const RequiredStar = styled.span`
  color: var(--error-color);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 15px;
  color: var(--text-light);
  font-size: 18px;
  pointer-events: none;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.hasIcon ? '12px 45px 12px 15px' : '12px 15px'};
  font-size: 16px;
  border: 1px solid ${props => props.hasError ? 'var(--error-color)' : '#ddd'};
  border-radius: 25px;
  background-color: #f9f9f9;
  transition: var(--transition);
  direction: rtl;
  font-family: 'Cairo', sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--error-color)' : 'var(--primary-color)'};
    box-shadow: 0 0 0 3px ${props => 
      props.hasError 
        ? 'rgba(220, 53, 69, 0.2)' 
        : 'rgba(94, 96, 206, 0.2)'
    };
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 14px;
  margin-top: 5px;
  font-weight: 500;
`;

export default FormInput;