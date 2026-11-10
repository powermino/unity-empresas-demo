export default function SectionHeading({ id, eyebrow, title, text, dark = false, align = 'left', className = '' }) {
  const center = align === 'center'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <p data-reveal className={`eyebrow ${dark ? 'text-electric-300' : 'text-electric'} ${center ? 'justify-center' : ''}`}>
          {eyebrow}
        </p>
      )}
      <h2 id={id} data-reveal className={`h-display mt-5 text-4xl sm:text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {text && (
        <p data-reveal className={`mt-6 text-base leading-relaxed sm:text-lg ${dark ? 'text-white/65' : 'text-navy-700/75'}`}>
          {text}
        </p>
      )}
    </div>
  )
}
