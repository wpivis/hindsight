library(ggplot2)
library(dplyr)
library(coin)
library(pwr)
library(shiny)
library(miniUI)
library(boot)
library(bootES)
library(tidyr)
library(irr)

# Bootstrap 95% CI for mean
# function to obtain mean from the data (with indexing)
mean.fun <- function(D, d) {
  return( mean(D[d]) )
}

# Reporting
report <- function(data, attr) {
  # bootstrapping with 1000 replications
  ci <- boot.ci(
    boot(data=data[[attr]], statistic=mean.fun, R=1000, sim="ordinary")
  )
  
  cat( "M=",     round( mean( data[[attr]] ), 1), "~", 
       "[", round( ci$bca[,4]          , 1), ",", 
            round( ci$bca[,5]          , 1), "]", 
  sep="")
}

reportES <- function(data, attr) {
  b <- bootES(data, 
              data.col=attr, 
              group.col="condition", 
              contrast=c(fade=1,nofade=-1), 
              effect.type="cohens.d"
  )

  cat( "d=",     round( b$t0, 2), "~", 
       "[", round( b$bounds[1], 2), ",", 
            round( b$bounds[2], 2), "]", 
  sep="")
}

ciplot <- function(V, range=0) {
  # bootstrapping with 1000 replications
  fadeci <- boot.ci(
    boot(data=fade[[V]], statistic=mean.fun, R=1000, sim="ordinary")
  )

  nofadeci <- boot.ci(
    boot(data=nofade[[V]], statistic=mean.fun, R=1000, sim="ordinary")
  )

  mean1 <- mean(fade[[V]])
  mean2 <- mean(nofade[[V]])

  df <- data.frame(
    trt = factor(c('fade', 'nofade')),
    resp = c(mean1, mean2),
    group = factor(c('fade', 'nofade')),
    upper = c(fadeci$bca[,5], nofadeci$bca[,5]),
    lower = c(fadeci$bca[,4], nofadeci$bca[,4])
  )

  p <- ggplot(df, aes(trt, resp, colour = group))
  p <- p + scale_color_manual(values=c("#F1A340", "#998EC3"))
  p <- p + theme(axis.title=element_text(size=20), axis.text=element_text(size=18))
  p <- p + geom_pointrange(aes(ymin = lower, ymax = upper)) 
  p <- p + expand_limits(y = range) 
  p <- p + ylab(V) 
  p <- p + xlab("") 
  p <- p + geom_errorbar(aes(ymin = lower, ymax = upper), width = 0.1) 
  p <- p + coord_flip() 
  p <- p + theme_bw() 
  p <- p + theme(plot.title=element_text(hjust=0))
  p <- p + theme(panel.border=element_blank())
  p <- p + theme(panel.grid.minor=element_blank())
  p <- p + theme(axis.ticks=element_blank())
  p <- p + theme(legend.key=element_rect(color="white"))
  p <- p + theme(text=element_text(family="Avenir Next Medium"))
  p <- p + theme(axis.text.y = element_blank())
  p <- p + guides(colour=FALSE)
  p
}

agreementRate <- function(cat) {

  #pre-process
  subData <- subset(data, category==cat)
  spreadSubData <- spread(subData, coder, code)
  coderData <- spreadSubData[, coderCol]

  # Column names as digits don't work in some functions -- changing
  colnames(coderData) <- c("one", "two", "three")

  #agreement rate
  agreeAll <- (coderData[,1] == coderData[,2] & coderData[,2] == coderData[,3])
  agreeTwo <- (coderData[,1] == coderData[,2] | coderData[,2] == coderData[,3] | coderData[,1] == coderData[,3])
  agreeAllRate <- sum(agreeAll) / length(agreeAll)*100
  agreeTwoRate <- sum(agreeTwo) / length(agreeTwo)*100
  print("Agreed by two:")
  print(sum(agreeTwo))
  print("Totally Disagreed:")
  print(length(agreeTwo) - sum(agreeTwo))
  
  #fleiss' kappa
  kappam.fleiss(coderData)

}
