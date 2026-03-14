import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Photo {
  image: string;
}

interface AboutProps {
  recipeDescription: string;
  photos: Photo[];
}

const About = ({ recipeDescription, photos }: AboutProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const validPhotos = photos?.filter((p) => p?.image) || [];

  const openLightbox = (index: number) => setSelectedPhotoIndex(index);
  const closeLightbox = () => setSelectedPhotoIndex(null);

  const nextPhoto = () => {
    if (selectedPhotoIndex !== null && validPhotos.length > 0) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % validPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex !== null && validPhotos.length > 0) {
      setSelectedPhotoIndex(
        (selectedPhotoIndex - 1 + validPhotos.length) % validPhotos.length
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Photo Gallery */}
      {validPhotos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-[#BE6F50] rounded-full" />
            Photos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {validPhotos.map((photo, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <img
                  src={photo.image}
                  alt={`Recipe photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#BE6F50] rounded-full" />
          About This Recipe
        </h2>
        <div className="bg-[#272727] rounded-xl p-6">
          <p className="text-gray-300 leading-relaxed text-base">
            {recipeDescription || "No description available."}
          </p>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && validPhotos[selectedPhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="text-2xl" />
            </button>

            {/* Navigation */}
            {validPhotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                  className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <FiChevronLeft className="text-2xl" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                  className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <FiChevronRight className="text-2xl" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.img
              key={selectedPhotoIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={validPhotos[selectedPhotoIndex].image}
              alt={`Recipe photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
              {selectedPhotoIndex + 1} / {validPhotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
