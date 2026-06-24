import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import CommunityList from "@/components/community/CommunityList";
import WritePostModal from "@/components/community/WritePostModal";
import EditPostModal from "@/components/community/EditPostModal";
import PostDetailPage from "@/pages/community/PostDetail";
import PanelHeader from "@/components/Panel/PanelHeader";

interface OutletContext {
  onToggle: () => void;
}

const Community = () => {
  const { onToggle } = useOutletContext<OutletContext>();
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [listKey, setListKey] = useState(0);

  const showRight = showWriteModal || selectedPostId !== null || editPostId !== null;

  return (
    <div className="flex h-full">
      <div className="w-[377px] flex-shrink-0 flex flex-col border-r border-gray-100">
        <PanelHeader onToggle={onToggle} />
        <CommunityList
          key={listKey}
          onWriteClick={() => {
            setSelectedPostId(null);
            setEditPostId(null);
            setShowWriteModal(true);
          }}
          onPostClick={(postId) => {
            setShowWriteModal(false);
            setEditPostId(null);
            setSelectedPostId(postId);
          }}
        />
      </div>
      <div className={`flex-shrink-0 flex flex-col transition-all duration-300 overflow-hidden ${showRight ? "w-[377px]" : "w-0"}`}>
        {showWriteModal && (
          <WritePostModal
            onClose={() => setShowWriteModal(false)}
            onSuccess={() => {
              setShowWriteModal(false);
              setListKey((prev) => prev + 1);
            }}
          />
        )}
        {editPostId !== null && (
          <EditPostModal
            postId={editPostId}
            onClose={() => {
              const id = editPostId;
              setEditPostId(null);
              setSelectedPostId(id);
            }}
            onSuccess={() => {
              const id = editPostId;
              setEditPostId(null);
              setSelectedPostId(id);
              setListKey((prev) => prev + 1);
            }}
          />
        )}
        {selectedPostId !== null && editPostId === null && !showWriteModal && (
          <PostDetailPage
            postId={selectedPostId}
            onClose={() => setSelectedPostId(null)}
            onDeleteSuccess={() => {
              setSelectedPostId(null);
              setListKey((prev) => prev + 1);
            }}
            onEditClick={(postId) => {
              setEditPostId(postId);
              setSelectedPostId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Community;
