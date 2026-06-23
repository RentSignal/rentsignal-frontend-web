import HeaderSection from "@/components/home/HeaderSection";
import RecommendationList from "@/components/home/RecommendationList";
import ResidenceReview from "@/components/home/ResidenceReview";
import SubwayList from "@/components/home/SubwayList";

const Home = () => (
  <div className="h-[calc(100vh-54px)] w-full overflow-y-auto pb-10 no-scrollbar">
    <HeaderSection />
    <RecommendationList />
    <SubwayList />
    <ResidenceReview />
  </div>
);

export default Home;
