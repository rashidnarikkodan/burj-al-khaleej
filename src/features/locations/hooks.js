import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLocations, addLocation, updateLocation, deleteLocation } from './api';

export const useLocations = (region = null) => {
  return useQuery({
    queryKey: ['locations', region],
    queryFn: () => getLocations(region)
  });
};

export const useAddLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};
