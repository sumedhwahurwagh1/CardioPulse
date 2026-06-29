import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Prediction } from '../Prediction';
import { apiService } from '../../services/api';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock apiService
vi.mock('../../services/api', () => ({
  apiService: {
    predict: vi.fn(),
  },
}));

describe('Prediction Component Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates through steps and submits using mouse clicks', async () => {
    // Mock successful prediction API response
    const mockResult = {
      prediction: 0,
      status: 'No Heart Disease',
      probability_disease: 0.1,
      probability_no_disease: 0.9,
      risk_level: 'Low',
      advice: ['Keep it up!'],
    };
    vi.mocked(apiService.predict).mockResolvedValueOnce(mockResult);

    render(<Prediction />);

    // Step 1 check
    expect(screen.getByText('Step 1: Personal Information')).toBeTruthy();
    
    // Find Next Step button
    const nextBtn1 = screen.getByRole('button', { name: /Go to the next step/i });
    
    // Click to Step 2
    fireEvent.click(nextBtn1);

    // Step 2 check
    expect(await screen.findByText('Step 2: Vital Measurements')).toBeTruthy();
    expect(screen.queryByText('Step 1: Personal Information')).toBeNull();

    // Find Next Step button again
    const nextBtn2 = screen.getByRole('button', { name: /Go to the next step/i });
    
    // Click to Step 3
    fireEvent.click(nextBtn2);

    // Step 3 check
    expect(await screen.findByText('Step 3: Clinical Indicators')).toBeTruthy();
    expect(screen.queryByText('Step 2: Vital Measurements')).toBeNull();

    // Find Submit button
    const submitBtn = screen.getByRole('button', { name: /Submit patient risk assessment form/i });
    
    // Click Submit
    fireEvent.click(submitBtn);

    // Verify submission and navigation
    await waitFor(() => {
      expect(apiService.predict).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/result', {
        state: {
          result: mockResult,
          input: expect.objectContaining({
            age: 45,
            sex: 1,
            resting_blood_pressure: 120,
            cholesterol: 200,
            max_heart_rate: 150,
          }),
        },
      });
    });
  });
});
