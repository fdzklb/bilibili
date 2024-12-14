import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 将秒数转换为 HH:MM:SS、MM:SS 或 SS 格式
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  } else
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

// 计算字符串匹配度
export interface MatchResult {
  lengthRatio: number // 长度占比
  similarity: number // 相似度
}
export function calculateMatchDegree(
  input: string,
  target: string
): MatchResult[] {
  // 将输入和目标字符串分割成单词数组
  const inputWords = input.trim().split(/\s+/)
  const targetWords = target.trim().split(/\s+/)

  // 动态规划数组，dp[i][j]表示输入前i个单词和目标前j个单词的最佳匹配结果
  const dp: Array<Array<{score: number, results: MatchResult[], maxConsecutive: number}>> = 
    Array(inputWords.length + 1).fill(null).map(() => 
      Array(targetWords.length + 1).fill(null).map(() => ({
        score: 0,
        results: [],
        maxConsecutive: 0
      }))
    )

  // 初始化第一行和第一列
  for(let i = 0; i <= inputWords.length; i++) {
    dp[i][0] = {score: 0, results: [], maxConsecutive: 0}
  }
  for(let j = 0; j <= targetWords.length; j++) {
    dp[0][j] = {score: 0, results: [], maxConsecutive: 0}
  }

  // 计算单词相似度
  const getSimilarity = (word1: string, word2: string): number => {
    if(word1 === word2) return 2
    if(word1.toLowerCase() === word2.toLowerCase()) return 1
    return 0
  }

  // 动态规划填表
  for(let i = 1; i <= inputWords.length; i++) {
    for(let j = 1; j <= targetWords.length; j++) {
      const similarity = getSimilarity(inputWords[i-1], targetWords[j-1])
      
      // 计算当前匹配的连续长度
      let consecutive = similarity > 0 ? 1 : 0
      if(i > 1 && j > 1 && dp[i-1][j-1].maxConsecutive > 0 && similarity > 0) {
        consecutive += dp[i-1][j-1].maxConsecutive
      }

      // 选择最优解
      const match = {
        score: dp[i-1][j-1].score + (similarity > 0 ? 1 : 0),
        results: [...dp[i-1][j-1].results, {
          lengthRatio: 100 * inputWords[i-1].length / target.length,
          similarity
        }],
        maxConsecutive: consecutive
      }

      const skip = dp[i][j-1]

      // 比较得分、连续匹配长度和顺序匹配
      if(match.score > skip.score || 
         (match.score === skip.score && match.maxConsecutive > skip.maxConsecutive)) {
        dp[i][j] = match
      } else {
        dp[i][j] = skip
      }
    }
  }

  // 补齐剩余的目标单词为未匹配状态
  const result = dp[inputWords.length][targetWords.length].results
  const unmatchedWords = targetWords.slice(result.length)
  
  // 为每个未匹配的单词添加其长度占比
  unmatchedWords.forEach(word => {
    result.push({
      lengthRatio: 100 * word.length / target.length,
      similarity: 0
    })
  })

  return result
}
