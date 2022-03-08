import { useEffect, useState } from "react";

import ModalAddFood from "../../components/ModalAddFood";

import { FoodsContainer } from "./styles";
import { Food, FoodType } from "../../components/Food";
import { Header } from "../../components/Header";
import { ModalEditFood } from "../../components/ModalEditFood";
import { api } from "../../services/api";

interface DashboardProps {}

export const Dashboard = (props: DashboardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [state, setState] = useState({
    foods: [] as FoodType[],
    editingFood: {} as FoodType,
  });

  useEffect(() => {
    api
      .get("/foods")
      .then((response) => setState({ ...state, foods: response.data }));
  }, []);

  const handleAddFood = async (food: FoodType) => {
    const { foods } = state;

    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setState({ ...state, foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: FoodType) => {
    const { foods, editingFood } = state;

    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setState({ ...state, foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: Number) => {
    const { foods } = state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setState({ ...state, foods: foodsFiltered });
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = () => {
    setModalEditOpen(!modalEditOpen);
  };

  const handleEditFood = (food: FoodType) => {
    setState({ ...state, editingFood: food });
    setModalEditOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={modalEditOpen}
        setIsOpen={toggleEditModal}
        editingFood={state.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {state.foods &&
          state.foods.map((food: FoodType) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              available={food.available}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
