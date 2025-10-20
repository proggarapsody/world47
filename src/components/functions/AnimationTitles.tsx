import React from 'react'
import { motion } from 'framer-motion'

interface AnimationTitlesProps {
  title: string
  className?: string
}

const AnimationTitles: React.FC<AnimationTitlesProps> = ({
  title,
  className,
}) => {
  const hVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const spanVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  }

  return (
    <motion.h1 variants={hVariants} initial="hidden" whileInView="visible">
      <span className={className}>
        {title.split('').map((char, index) => (
          <motion.span variants={spanVariants} key={index}>
            {char}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  )
}

export default AnimationTitles
