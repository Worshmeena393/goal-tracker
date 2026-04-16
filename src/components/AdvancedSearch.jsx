import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Menu,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Sort as SortIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const AdvancedSearch = ({ 
  goals, 
  onSearch, 
  onFilter, 
  onSort, 
  categories = [],
  placeholder = "Search goals...",
  showFilters = true,
  showSort = true 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'completed', label: 'Completed', color: 'primary' },
    { value: 'paused', label: 'Paused', color: 'warning' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: CalendarIcon },
    { value: 'oldest', label: 'Oldest First', icon: CalendarIcon },
    { value: 'progress', label: 'Most Progress', icon: TrendingIcon },
    { value: 'name', label: 'Alphabetical', icon: SortIcon },
    { value: 'priority', label: 'Priority', icon: StarIcon },
  ];

  // Filter and search logic
  const filteredGoals = useMemo(() => {
    let filtered = goals || [];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(goal =>
        goal.title.toLowerCase().includes(query) ||
        (goal.notes && goal.notes.toLowerCase().includes(query)) ||
        (goal.category && goal.category.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(goal =>
        selectedCategories.includes(goal.category || 'General')
      );
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(goal =>
        selectedStatuses.includes(goal.status)
      );
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(goal =>
        new Date(goal.createdAt) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(goal =>
        new Date(goal.createdAt) <= new Date(dateRange.end)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'progress':
          return (b.progress / b.target) - (a.progress / a.target);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'priority':
          return (b.priority || 0) - (a.priority || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [goals, searchQuery, selectedCategories, selectedStatuses, dateRange, sortBy]);

  // Notify parent of changes
  useEffect(() => {
    onSearch?.(filteredGoals);
    onFilter?.({ searchQuery, selectedCategories, selectedStatuses, dateRange });
    onSort?.(sortBy);
  }, [filteredGoals, searchQuery, selectedCategories, selectedStatuses, dateRange, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setDateRange({ start: '', end: '' });
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || 
    selectedCategories.length > 0 || 
    selectedStatuses.length > 0 || 
    dateRange.start || 
    dateRange.end;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
        }}
      >
        {/* Main Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            data-testid="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          
          {showFilters && (
            <Tooltip title="Advanced Filters">
              <IconButton
                onClick={() => setShowAdvanced(!showAdvanced)}
                color={showAdvanced ? 'primary' : 'default'}
                sx={{
                  borderRadius: 2,
                  backgroundColor: showAdvanced ? 'primary.main' : 'transparent',
                  color: showAdvanced ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: showAdvanced ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Active Filters Display */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {searchQuery && (
                  <Chip
                    label={`Search: "${searchQuery}"`}
                    onDelete={() => setSearchQuery('')}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}
                {selectedCategories.map(category => (
                  <Chip
                    key={category}
                    label={category}
                    onDelete={() => setSelectedCategories(prev => 
                      prev.filter(c => c !== category)
                    )}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                ))}
                {selectedStatuses.map(status => (
                  <Chip
                    key={status}
                    label={statusOptions.find(s => s.value === status)?.label || status}
                    onDelete={() => setSelectedStatuses(prev => 
                      prev.filter(s => s !== status)
                    )}
                    color={statusOptions.find(s => s.value === status)?.color || 'default'}
                    variant="outlined"
                    size="small"
                  />
                ))}
                {(dateRange.start || dateRange.end) && (
                  <Chip
                    label={`Date: ${dateRange.start || '...'} - ${dateRange.end || '...'}`}
                    onDelete={() => setDateRange({ start: '', end: '' })}
                    color="info"
                    variant="outlined"
                    size="small"
                  />
                )}
                <Chip
                  label="Clear All"
                  onDelete={clearAllFilters}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Category Filter */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    multiple
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        <Checkbox checked={selectedCategories.indexOf(category) > -1} size="small" />
                        <ListItemText primary={category} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Status Filter */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    multiple
                    value={selectedStatuses}
                    onChange={(e) => setSelectedStatuses(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={statusOptions.find(s => s.value === value)?.label || value} 
                            size="small" 
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        <Checkbox checked={selectedStatuses.indexOf(status.value) > -1} size="small" />
                        <ListItemText primary={status.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Sort */}
                {showSort && (
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      startAdornment={<SortIcon sx={{ mr: 1, fontSize: 18 }} />}
                    >
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <option.icon sx={{ fontSize: 16 }} />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Date Range */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    size="small"
                    type="date"
                    label="From"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    size="small"
                    type="date"
                    label="To"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filteredGoals.length} result{filteredGoals.length !== 1 ? 's' : ''} found
            {goals && filteredGoals.length !== goals.length && ` of ${goals.length} total`}
          </Typography>
        </motion.div>
      </Paper>
    </motion.div>
  );
};

export default AdvancedSearch;
