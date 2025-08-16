import {Container} from '@mui/material'
import useWeather from './components/hooks/useWeather';
import useCrud from './components/hooks/useCrud';
import SearchForm from './components/SearchForm';
import CrudButtons from './components/CrudButtons';
import WeatherDisplay from './components/WeatherDisplay';
import ReadDialog from './components/dialogs/ReadDialog';
import UpdateDialog from './components/dialogs/UpdateDialog';
import DeleteDialog from './components/dialogs/DeleteDialog';
import Header from './components/Header';

  function App() {
    const weatherState = useWeather();
    const crudState = useCrud({
      city : weatherState.city,
      inputValue: weatherState.inputValue,
      startDate: weatherState.startDate,
      endDate: weatherState.endDate,
      searchType: weatherState.searchType
    });
  return (
    <div>
        <Container>
          <Header />
          <div style={{ padding: 20 }}>
            <SearchForm
              searchType={weatherState.searchType}
              setSearchType={weatherState.setSearchType}
              inputValue={weatherState.inputValue}
              setInputValue={weatherState.setInputValue}
              startDate={weatherState.startDate}
              setStartDate={weatherState.setStartDate}
              endDate={weatherState.endDate}
              setEndDate={weatherState.setEndDate}
              onSearch={weatherState.handleSearch}
              onUseCurrentLocation={weatherState.fetchLocationByIP}
            />
            {weatherState.error && (
              <div style={{ color: "red", marginBottom: 10 }}>{weatherState.error}</div>
            )}
            <CrudButtons
              onInsert={crudState.handleInsert}
              onRead={crudState.handleRead}
              onUpdate={crudState.handleUpdate}
              onDelete={crudState.handleDelete}
            />
            <WeatherDisplay
              weather={weatherState.weather}
              dailyForecast={weatherState.dailyForecast}
              rangeForecast={weatherState.rangeForecast}
            />
            <ReadDialog
              open={crudState.readOpen}
              onClose={() => crudState.setReadOpen(false)}
              data={crudState.dbData}
            />
            <UpdateDialog
              open={crudState.updateListOpen}
              onClose={() => crudState.setUpdateListOpen(false)}
              data={crudState.dbData}
              editOpen={crudState.editOpen}
              setEditOpen={crudState.setEditOpen}
              selectedRecord={crudState.selectedRecord}
              openEditDialog={crudState.openEditDialog}
              editForm={crudState.editForm}
              handleEditChange={crudState.handleEditChange}
              handleSaveUpdate={crudState.handleSaveUpdate}
            />
            <DeleteDialog
              open={crudState.deleteListOpen}
              onClose={() => crudState.setDeleteListOpen(false)}
              data={crudState.dbData}
              requestDeleteRecord={crudState.requestDeleteRecord}
              confirmDeleteOpen={crudState.confirmDeleteOpen}
              setConfirmDeleteOpen={crudState.setConfirmDeleteOpen}
              recordToDelete={crudState.recordToDelete}
              handleConfirmDelete={crudState.handleConfirmDelete}
            />
          </div>
        </Container>
    </div>
  )
}

export default App