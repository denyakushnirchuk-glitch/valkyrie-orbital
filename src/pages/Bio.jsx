import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '../lib/supabase'
import styles from './Bio.module.css'

export default function Bio() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('bio')
      .select('content')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setContent(data?.content || '')
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className={styles.loading}>Loading agency profile…</div>
  )

  if (!content) return (
    <div className={styles.loading}>Agency profile not yet written.</div>
  )

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Kerbin Aerospace</p>
        <h1 className={styles.title}>Agency profile</h1>
      </div>
      <div className={styles.body}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className={styles.h1} {...props} />,
            h2: ({node, ...props}) => <h2 className={styles.h2} {...props} />,
            h3: ({node, ...props}) => <h3 className={styles.h3} {...props} />,
            p:  ({node, ...props}) => <p  className={styles.p}  {...props} />,
            ul: ({node, ...props}) => <ul className={styles.ul} {...props} />,
            ol: ({node, ...props}) => <ol className={styles.ol} {...props} />,
            li: ({node, ...props}) => <li className={styles.li} {...props} />,
            blockquote: ({node, ...props}) => <blockquote className={styles.blockquote} {...props} />,
            strong: ({node, ...props}) => <strong className={styles.strong} {...props} />,
            hr: ({node, ...props}) => <hr className={styles.hr} {...props} />,
            table: ({node, ...props}) => (
              <div className={styles.tableWrap}>
                <table className={styles.table} {...props} />
              </div>
            ),
            th: ({node, ...props}) => <th className={styles.th} {...props} />,
            td: ({node, ...props}) => <td className={styles.td} {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </main>
  )
}