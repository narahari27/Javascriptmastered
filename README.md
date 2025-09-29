STEP 1: Create the Main Dashboard Container Widget
This widget will be the parent container that holds:

Header with date picker and dropdowns
All chart widgets as children

Main Dashboard Widget Structure:
HTML Template:
├── Header Section
│   ├── Menu Dropdown
│   ├── Select Values Dropdown  
│   └── Date Range Picker
└── Content Section
    ├── Chart Widget 1 (Bar Chart)
    ├── Chart Widget 2 (Bubble Chart)
    ├── Chart Widget 3 (Doughnut Chart)
    └── ... more chart widgets
Key Responsibilities:

Initialize date range picker
Store current date range in scope
Broadcast date changes to child widgets
Handle dashboard navigation


STEP 2: Implement Date Picker in Main Widget
HTML Template (Main Dashboard Widget):
html<div class="dashboard-container">
  <!-- Header Section -->
  <div class="dashboard-header">
    <div class="header-controls">
      <!-- Menu Dropdown -->
      <div class="control-item">
        <label>Dashboard:</label>
        <select ng-model="c.selectedDashboard" ng-change="c.changeDashboard()">
          <option value="overview">Overview</option>
          <option value="analytics">Analytics</option>
          <option value="reports">Reports</option>
        </select>
      </div>
      
      <!-- Select Values Dropdown -->
      <div class="control-item">
        <label>Filter:</label>
        <select ng-model="c.selectedFilter" ng-change="c.applyFilter()">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      
      <!-- Date Range Picker -->
      <div class="control-item date-picker-wrapper">
        <label>Date Range:</label>
        <input type="text" id="mainDatePicker_{{c.widget.id}}" class="date-range-input"/>
      </div>
    </div>
    
    <!-- Optional: Display current date range -->
    <div class="date-info">
      <span>{{c.dateRangeDisplay}}</span>
    </div>
  </div>
  
  <!-- Content Section - Chart Widgets -->
  <div class="dashboard-content">
    <div class="chart-grid">
      <!-- Each chart widget will be embedded here -->
      <!-- These would be separate widget instances in ServiceNow -->
    </div>
  </div>
</div>

STEP 3: Main Widget Controller with Date Management
Controller (Main Dashboard Widget):
javascriptapi.controller = function($scope, $rootScope, $timeout) {
  var c = this;
  
  // Initialize state
  c.selectedDashboard = 'overview';
  c.selectedFilter = 'all';
  c.currentDateRange = {
    startDate: null,
    endDate: null
  };
  c.dateRangeDisplay = '';
  
  // Initialize date range picker
  c.initDateRangePicker = function() {
    var dateInput = $('#mainDatePicker_' + c.widget.id);
    
    dateInput.daterangepicker({
      startDate: moment().subtract(29, 'days'),
      endDate: moment(),
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), 
                       moment().subtract(1, 'month').endOf('month')]
      },
      showDropdowns: true,
      alwaysShowCalendars: true,
      opens: "left",
      locale: {
        format: "MM/DD/YYYY",
        separator: " - ",
        applyLabel: "Apply",
        cancelLabel: "Cancel"
      }
    }, function(start, end, label) {
      // This callback fires when user applies date selection
      c.handleDateChange(start, end, label);
    });
    
    // Set initial dates
    var initialStart = moment().subtract(29, 'days');
    var initialEnd = moment();
    c.handleDateChange(initialStart, initialEnd, 'Last 30 Days');
  };
  
  // Handle date change - CRITICAL FUNCTION
  c.handleDateChange = function(startDate, endDate, label) {
    // Update internal state
    c.currentDateRange.startDate = startDate;
    c.currentDateRange.endDate = endDate;
    
    // Update display
    c.dateRangeDisplay = startDate.format('MMM DD, YYYY') + ' - ' + 
                         endDate.format('MMM DD, YYYY');
    
    // Broadcast to all child chart widgets
    $rootScope.$broadcast('dateRangeChanged', {
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      startMoment: startDate,
      endMoment: endDate,
      label: label
    });
    
    console.log('Date range changed:', {
      start: startDate.format('YYYY-MM-DD'),
      end: endDate.format('YYYY-MM-DD')
    });
    
    // Apply Angular digest if needed
    $timeout(function() {
      $scope.$apply();
    });
  };
  
  // Dashboard navigation
  c.changeDashboard = function() {
    console.log('Dashboard changed to:', c.selectedDashboard);
    // Handle dashboard switching logic
  };
  
  // Filter handling
  c.applyFilter = function() {
    console.log('Filter changed to:', c.selectedFilter);
    // Broadcast filter change if needed
    $rootScope.$broadcast('filterChanged', {
      filter: c.selectedFilter
    });
  };
  
  // Initialize on load
  c.$onInit = function() {
    $timeout(function() {
      c.initDateRangePicker();
    }, 200);
  };
  
  // Cleanup
  c.$onDestroy = function() {
    var dateInput = $('#mainDatePicker_' + c.widget.id);
    if (dateInput.data('daterangepicker')) {
      dateInput.data('daterangepicker').remove();
    }
  };
};

STEP 4: Update Individual Chart Widgets to Listen for Date Changes
Now modify each chart widget (Bar, Bubble, Doughnut, etc.) to listen for date changes.
Example: Grouped Bar Chart Widget (Updated)
javascriptapi.controller = function($scope, $timeout) {
  var c = this;
  c.chart = null;
  c.currentDateRange = null;
  
  // Your existing weekly data
  var weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [25, 35, 45, 30, 55, 20, 40]
  };
  
  // Listen for date range changes from parent
  var dateListener = $scope.$on('dateRangeChanged', function(event, dateData) {
    console.log('Bar chart received date change:', dateData);
    c.currentDateRange = dateData;
    
    // Call your API or update data based on new dates
    c.fetchDataForDateRange(dateData.startDate, dateData.endDate);
  });
  
  // Fetch data from API based on date range
  c.fetchDataForDateRange = function(startDate, endDate) {
    // Show loading state
    c.isLoading = true;
    
    // Make API call with date parameters
    // Example API call structure:
    /*
    c.server.get({
      table: 'your_table',
      startDate: startDate,
      endDate: endDate
    }).then(function(response) {
      // Update chart with new data
      c.updateChartData(response.data);
      c.isLoading = false;
    });
    */
    
    // For now, simulate data update
    $timeout(function() {
      c.updateChartData(weeklyData);
      c.isLoading = false;
    }, 500);
  };
  
  // Update chart with new data
  c.updateChartData = function(newData) {
    if (!c.chart) return;
    
    c.chart.data.labels = newData.labels;
    c.chart.data.datasets[0].data = newData.values;
    c.chart.update();
  };
  
  // Build dataset function
  function buildDataset() {
    return [{
      label: 'Daily Values',
      data: weeklyData.values,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2
    }];
  }
  
  // Create chart function (your existing code)
  function createChart() {
    var id = 'barChart_' + c.widget.id;
    var ctx = document.getElementById(id);
    if (!ctx || !window.Chart) return;
    
    if (c.chart) {
      c.chart.destroy();
      c.chart = null;
    }
    
    c.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: weeklyData.labels,
        datasets: buildDataset()
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            max: 90,
            ticks: {
              stepSize: 15
            },
            title: {
              display: true,
              text: 'Values'
            },
            grid: {
              color: '#eee',
              lineWidth: 0.8
            }
          }
        }
      }
    });
  }
  
  // Init function
  c.init = function() {
    var tries = 0;
    (function wait() {
      var ready = !!window.Chart && 
                  !!document.getElementById('barChart_' + c.widget.id);
      if (ready) {
        createChart();
      } else if (tries++ < 60) {
        $timeout(wait, 100);
      }
    })();
  };
  
  c.$onInit = function() {
    c.init();
  };
  
  c.$onDestroy = function() {
    // Remove event listener
    dateListener();
    
    // Destroy chart
    if (c.chart) {
      c.chart.destroy();
    }
  };
};

STEP 5: CSS Styling for Main Dashboard
css/* Main Dashboard Styles */
.dashboard-container {
  width: 100%;
  padding: 20px;
}

.dashboard-header {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-controls {
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-item label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.control-item select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.date-picker-wrapper {
  flex: 1;
  min-width: 250px;
}

.date-range-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.date-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
  color: #666;
  font-size: 13px;
}

.dashboard-content {
  margin-top: 20px;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

/* Loading state */
.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #666;
}

STEP 6: Implementation Checklist
Phase 1: Setup

 Create main dashboard container widget
 Add date range picker libraries (already in your docs)
 Add header HTML with date picker
 Implement date picker initialization

Phase 2: Date Broadcasting

 Implement handleDateChange function
 Set up $rootScope.$broadcast for date changes
 Test date picker and console log broadcasts

Phase 3: Chart Updates

 Add $scope.$on listeners to each chart widget
 Implement fetchDataForDateRange in each chart
 Test individual chart updates

Phase 4: API Integration

 Connect to actual API endpoints
 Add loading states to charts
 Handle API errors gracefully
 Add data transformation logic

Phase 5: Testing

 Test date picker with single chart
 Test date picker with multiple charts
 Test dashboard navigation
 Test filter dropdown (if applicable)
 Test error scenarios


STEP 7: Communication Flow Diagram
User Changes Date
       ↓
Date Picker Callback
       ↓
handleDateChange()
       ↓
$rootScope.$broadcast('dateRangeChanged', {...})
       ↓
       ├─→ Bar Chart Widget → fetchDataForDateRange() → Update Chart
       ├─→ Bubble Chart Widget → fetchDataForDateRange() → Update Chart
       ├─→ Doughnut Chart Widget → fetchDataForDateRange() → Update Chart
       └─→ ... other widgets → fetchDataForDateRange() → Update Chart

KEY POINTS:

Single Source of Truth: Date picker in main widget controls all charts
Event-Based: Use $rootScope.$broadcast for communication
Independent Charts: Each chart handles its own data fetching
Modular: Easy to add/remove charts without affecting others
Scalable: Works with any number of chart widgets

Would you like me to create the complete code for any specific step or clarify any part of this implementation?
